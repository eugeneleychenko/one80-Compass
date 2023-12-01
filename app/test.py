import requests
import os
from dotenv import load_dotenv
from langchain.vectorstores import FAISS
from langchain.embeddings.openai import OpenAIEmbeddings
import numpy as np
import faiss

# Load environment variables and initialize OpenAI embeddings
load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")
openai_embeddings = OpenAIEmbeddings(api_key=openai_api_key)

# Fetch the data from the provided URL
data_url = 'https://gs.jasonaa.me/?url=https://docs.google.com/spreadsheets/d/e/2PACX-1vSmp889ksBKKVVwpaxhlIzpDzXNOWjnszEXBP7SC5AyoebSIBFuX5qrcwwv6ud4RCYw2t_BZRhGLT0u/pubhtml?gid=1980586524&single=true'
response = requests.get(data_url)
data = response.json()

# Extract journey names and methods
journey_names = [item['Journey Name (N)'] for item in data]
methods = {item['Journey Name (N)']: item['Methods (N)'] for item in data}

# Convert the journey names to embeddings
embeddings = [openai_embeddings.embed_query(name) for name in journey_names]

# Assuming `embeddings` is a list of numpy arrays
# First, we need to convert the list of numpy arrays into a 2D numpy array
embeddings_matrix = np.vstack(embeddings)

# Create a FAISS index
dimension = embeddings_matrix.shape[1]  # Dimension of the embeddings
index = faiss.IndexFlatL2(dimension)    # Using L2 distance for similarity

# Add the embeddings to the index
index.add(embeddings_matrix)

# The docstore can be your journey_names if it's a list
docstore = journey_names

# If your docstore is a list, the index_to_docstore_id can be an identity function
# since the indices will match
index_to_docstore_id = lambda x: x

# Now, create the FAISS vector store with the required arguments
vector_store = FAISS(index=index, docstore=docstore, index_to_docstore_id=index_to_docstore_id, embedding_function=openai_embeddings.embed_query)

# Function to find the best match for a query
def find_best_match(query):
    query_embedding = openai_embeddings.embed_query(query)
    # Inside the find_best_match function
    distances, indices = vector_store.search(query_embedding, k=1, search_type='similarity')
    best_match_index = indices[0][0]
    best_match_name = journey_names[best_match_index]
    similarity_score = 1 - distances[0][0]
    methods_associated = methods[best_match_name]
    return best_match_name, similarity_score, methods_associated

# Example usage
query = "Improve employee experience"
best_match_name, similarity_score, methods_associated = find_best_match(query)
print(f"Journey Name: {best_match_name}")
print(f"Similarity Score: {similarity_score:.2%}")
print(f"Methods: {methods_associated}")
