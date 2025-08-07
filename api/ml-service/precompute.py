import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import pickle

# --- 1. SETUP AND DATA LOADING ---
print("Starting pre-computation script...")
load_dotenv()
MONGO_URI = os.getenv('MONGO_URI')

if not MONGO_URI:
    raise Exception("MONGO_URI not found in .env file. Please create one.")

# Connect to MongoDB
print("Connecting to MongoDB...")
client = MongoClient(MONGO_URI)
# Explicitly select the 'test' database where the screenshot shows the data is
db = client['test'] 
movies_collection = db.movies

# Load data from MongoDB into a pandas DataFrame
# We only need specific fields for this calculation
cursor = movies_collection.find({}, {'_id': 0, 'tmdbId': 1, 'title': 1, 'overview': 1, 'genres': 1})
movies_df = pd.DataFrame(list(cursor))
print(f"Loaded {len(movies_df)} movies from the database.")

# --- 2. FEATURE ENGINEERING ---
# For any movies with missing overview, fill with an empty string
movies_df['overview'] = movies_df['overview'].fillna('')

# Create a 'soup' of features to represent each movie's content
def create_soup(x):
    # Extract genre names from the list of genre objects
    genres = ' '.join([i['name'] for i in x['genres']])
    # Combine overview and genres. You could add more features here (e.g., director, cast)
    return x['overview'] + ' ' + genres

print("Creating feature 'soup' for each movie...")
movies_df['soup'] = movies_df.apply(create_soup, axis=1)

# --- 3. VECTORIZATION & SIMILARITY CALCULATION ---
# Use TF-IDF to convert the text 'soup' into a matrix of numerical features
# stop_words='english' removes common words that don't add much meaning
tfidf = TfidfVectorizer(stop_words='english')
print("Calculating TF-IDF matrix... (This may take a few minutes)")
tfidf_matrix = tfidf.fit_transform(movies_df['soup'])

# Calculate the cosine similarity matrix
print("Calculating cosine similarity matrix...")
cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

# --- 4. SAVING THE COMPUTED DATA ---
# We need to save the similarity matrix and the dataframe (with tmdbId and title)
# so our API can load them quickly without re-calculating.
output_dir = 'computed_data'
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# We only need the tmdbId and title for the final mapping
movies_for_api = movies_df[['tmdbId', 'title']].reset_index()

print(f"Saving cosine similarity matrix to '{output_dir}/cosine_sim.pkl'")
pickle.dump(cosine_sim, open(f'{output_dir}/cosine_sim.pkl', 'wb'))

print(f"Saving movies list to '{output_dir}/movies.pkl'")
pickle.dump(movies_for_api, open(f'{output_dir}/movies.pkl', 'wb'))

print("Pre-computation complete! The ML service is ready to be started.")
client.close()