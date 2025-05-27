import geopandas as gpd

# Load county GeoJSON (adjust path if needed)
gdf_main = gpd.read_file('public/counties.geojson')

# Dissolve counties to form state boundaries
gdf_states = gdf_main.dissolve(by='STATEFP', as_index=False)

# Save output GeoJSON for React
gdf_states.to_file('public/states.geojson', driver='GeoJSON')

print("Done: states.geojson written to public/")
