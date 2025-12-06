# UltraReal Backend

## Setup
1. Ensure MongoDB is running.
2. Install dependencies (in the root or backend folder depending on repo structure):
   ```bash
   npm install mongoose dotenv ts-node typescript @types/node @types/mongoose
   ```

## Running the Seed Script
To populate the database with the initial demo data:

```bash
# Set your connection string if different
export MONGODB_URI=mongodb://localhost:27017/ultrareal_crm

# Run the script using ts-node
npx ts-node backend/seed/seed.ts
```

## Verifying Data
You can check the data using `mongosh` or MongoDB Compass:

```javascript
use ultrareal_crm
db.users.find().pretty()
db.vendors.find().pretty()
db.properties.find().pretty()
```
