import json

# Load the original file
with open('your_file_cleaned.json', 'r', encoding='utf-8') as f:
    leaders = json.load(f)

# Remove the 'id' key from each entry
for leader in leaders:
    leader.pop('id', None)

# Save the cleaned file (can overwrite or make a new one)
with open('curated_leaders_cleaned.json', 'w', encoding='utf-8') as f:
    json.dump(leaders, f, indent=2)

print("✅ Cleaned JSON saved as curated_leaders_cleaned.json")
