import pandas as pd
from ace_tools import display_dataframe_to_user

# Read the CSV using the correct header row (row 2 in the file, zero-indexed header=1)
file_path = "/mnt/data/Jalsa-duty list 2025 (1).xlsx - Sheet1 (3).csv"
df = pd.read_csv(file_path, header=1, dtype=str)

# Keep only the two relevant columns and rename them
df_clean = df[['Functie', 'Naam']].rename(columns={'Functie': 'Role', 'Naam': 'Name'})

# Drop rows where both Role and Name are empty or NaN
df_clean = df_clean.dropna(how='all')

# Strip whitespace from entries
df_clean['Role'] = df_clean['Role'].str.strip()
df_clean['Name'] = df_clean['Name'].str.strip()

# Save the cleaned CSV
output_path = "/mnt/data/cleaned_badges_corrected.csv"
df_clean.to_csv(output_path, index=False)

# Display the cleaned DataFrame to the user
display_dataframe_to_user("Cleaned CSV Preview", df_clean)

print(f"Cleaned CSV saved to {output_path}")
