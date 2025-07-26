# How to Run Fabl Apps

You have two completely separate applications that need to be run independently:

## 1. Main App (localhost:3000)

Open Terminal #1:
```bash
npm run dev
```

## 2. Studio App (localhost:3001)

Open Terminal #2:
```bash
cd apps/studio
npm run dev
```

OR use the helper script:
```bash
./run-studio.sh
```

## 3. Run Both Together

If you want to run both apps in one terminal:
```bash
# First install npm-run-all if you haven't already
npm install

# Then run both apps
npm run dev:all
```

## Important Notes

- Each app runs on its own port
- You need separate terminal windows OR use the `dev:all` command
- Studio runs on port 3001, NOT through subdomain routing
- If you see the main app on port 3001, it means the studio isn't running

## Troubleshooting

If studio won't start:
1. Make sure you're in the studio directory: `cd apps/studio`
2. Install dependencies: `npm install`
3. Run the dev server: `npm run dev`

The studio should show a different UI with purple/glassmorphism design, not the main app.