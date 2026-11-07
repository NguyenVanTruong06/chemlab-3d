"""
ChemLab 3D Data Synchronization Script
Reads chemistry data from CSV or Google Sheets and generates typed JSON for the Web App.
"""
import csv
import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "src", "data")
os.makedirs(DATA_DIR, exist_ok=True)

def csv_to_json(csv_path, json_path):
    with open(csv_path, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        data = [row for row in reader]
    with open(json_path, mode="w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Synced {len(data)} items: {csv_path} -> {json_path}")

def main():
    csv_to_json("/tmp/sheet1_hoachat.csv", os.path.join(DATA_DIR, "chemicals.json"))
    csv_to_json("/tmp/sheet2_phanung.csv", os.path.join(DATA_DIR, "reactions.json"))
    csv_to_json("/tmp/sheet3_baihoc.csv", os.path.join(DATA_DIR, "lessons.json"))

if __name__ == "__main__":
    main()
