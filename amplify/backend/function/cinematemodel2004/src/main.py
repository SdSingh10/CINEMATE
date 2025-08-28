import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import awswrangler as wr  # Using AWS Wrangler
import os
from mangum import Mangum  # <-- added for AWS Lambda adapter

# --- 1. AWS SETUP AND MODEL LOADING ---
# Amplify will provide the S3 bucket name as an environment variable
S3_BUCKET_NAME = os.environ.get("S3_BUCKET_NAME")

app = FastAPI(title="CINEMATE Recommendation Service")

try:
    print(f"Loading data from S3 bucket: s3://{S3_BUCKET_NAME}/movies.pkl")
    # Use AWS Wrangler to easily read objects from S3
    movies_df = wr.s3.read_pickle(path=f"s3://{S3_BUCKET_NAME}/movies.pkl")
    cosine_sim = wr.s3.read_pickle(path=f"s3://{S3_BUCKET_NAME}/cosine_sim.pkl")
    print("Data loaded successfully.")
except Exception as e:
    print(f"ERROR: Could not load data from S3. {e}")
    # For Lambda, raise instead of exit so errors show in CloudWatch
    raise

indices = pd.Series(movies_df.index, index=movies_df["title"]).drop_duplicates()

# --- 2. API DATA MODELS ---
class RecommendationRequest(BaseModel):
    title: str
    num_recommendations: int = 10


class RecommendationResponse(BaseModel):
    message: str
    recommendations: list[str]  # A list of tmdbIds


# --- 3. API ENDPOINTS ---
@app.post("/recommend", response_model=RecommendationResponse)
def get_recommendations(request: RecommendationRequest):
    """
    Accepts a movie title and returns a list of recommended movie tmdbIds.
    """
    title = request.title
    num_recommendations = request.num_recommendations

    print(f"Received recommendation request for title: '{title}'")

    if title not in indices:
        raise HTTPException(
            status_code=404,
            detail=f"Movie with title '{title}' not found in the dataset.",
        )

    idx = indices[title]

    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1 : num_recommendations + 1]  # skip itself

    movie_indices = [i[0] for i in sim_scores]
    recommended_tmdb_ids = movies_df["tmdbId"].iloc[movie_indices].tolist()

    return {
        "message": "Recommendations generated successfully.",
        "recommendations": recommended_tmdb_ids,
    }


@app.get("/")
def read_root():
    return {"status": "CINEMATE ML Service is running."}


# --- 4. LAMBDA HANDLER ---
handler = Mangum(app)
