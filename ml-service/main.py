import pickle
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

# --- 1. SETUP AND MODEL LOADING ---
app = FastAPI(
    title="CINEMATE Recommendation Service",
    description="A machine learning microservice for providing movie recommendations.",
    version="1.0.0"
)

# Load the pre-computed data when the application starts
try:
    print("Loading pre-computed data...")
    movies_df = pickle.load(open('computed_data/movies.pkl', 'rb'))
    cosine_sim = pickle.load(open('computed_data/cosine_sim.pkl', 'rb'))
    print("Data loaded successfully.")
except FileNotFoundError:
    print("ERROR: Computed data files not found. Please run precompute.py first.")
    # In a real production app, you might want to handle this more gracefully
    exit()

# Create a mapping from movie title to dataframe index for quick lookups
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