import pickle
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import awswrangler as wr # Using AWS Wrangler
import os

# --- 1. AWS SETUP AND MODEL LOADING ---
# Amplify will provide the S3 bucket name as an environment variable
S3_BUCKET_NAME = os.environ.get('S3_BUCKET_NAME')

app = FastAPI(title="CINEMATE Recommendation Service")

try:
    print(f"Loading data from S3 bucket: s3://{S3_BUCKET_NAME}/movies.pkl")
    # Use AWS Wrangler to easily read objects from S3
    movies_df = wr.s3.read_pickle(path=f"s3://{S3_BUCKET_NAME}/movies.pkl")
    cosine_sim = wr.s3.read_pickle(path=f"s3://{S3_BUCKET_NAME}/cosine_sim.pkl")
    print("Data loaded successfully.")
except Exception as e:
    print(f"ERROR: Could not load data from S3. {e}")
    exit()

indices = pd.Series(movies_df.index, index=movies_df['title']).drop_duplicates()

# --- 2. API DATA MODELS ---
# Define the structure of the request body using Pydantic
class RecommendationRequest(BaseModel):
    title: str
    num_recommendations: int = 10

# Define the structure of the response
class RecommendationResponse(BaseModel):
    message: str
    recommendations: list[str] # A list of tmdbIds

# --- 3. API ENDPOINT ---
@app.post("/recommend", response_model=RecommendationResponse)
def get_recommendations(request: RecommendationRequest):
    """
    Accepts a movie title and returns a list of recommended movie tmdbIds.
    """
    title = request.title
    num_recommendations = request.num_recommendations

    print(f"Received recommendation request for title: '{title}'")

    # Check if the movie title exists in our dataset
    if title not in indices:
        raise HTTPException(
            status_code=404,
            detail=f"Movie with title '{title}' not found in the dataset."
        )

    # Get the index of the movie that matches the title
    idx = indices[title]

    # Get the pairwise similarity scores of all movies with that movie
    sim_scores = list(enumerate(cosine_sim[idx]))

    # Sort the movies based on the similarity scores
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

    # Get the scores of the 10 most similar movies (index 0 is the movie itself)
    sim_scores = sim_scores[1:num_recommendations + 1]

    # Get the movie indices
    movie_indices = [i[0] for i in sim_scores]

    # Get the tmdbIds for the top recommended movies
    recommended_tmdb_ids = movies_df['tmdbId'].iloc[movie_indices].tolist()

    return {
        "message": "Recommendations generated successfully.",
        "recommendations": recommended_tmdb_ids
    }

@app.get("/")
def read_root():
    return {"status": "CINEMATE ML Service is running."}