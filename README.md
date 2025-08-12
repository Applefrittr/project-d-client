**Project D**

Auto battler multiplayer game with player created decks to turn the tide of battle in their favor.

**Features**:

- Auto battler in the same vein as in League of Legends ARAM/Summoners Rift where waves of AI controlled minions battle/tug of war for control of arena - 1-2 combat lanes.
- Lanes will contain tower defense structures - once destroyed grant player currency or benefit the player in some capacity
- Currency generated during games can be used to upgrade and spawn more minions each wave
- Rougelite feature: Each player can create/customize a deck of cards to power up their minions, debuff their opponents minions, summon heroes, etc to help push their battle line forward
- To be a more complex than games like Clash of Clans, introduce card combos and chaining to create powerful effects (in the same vein as Yu-Gi-Oh)
- ??? Gacha deck building - players can buy (earned/bought in-game currency) 'booster' packs to build out a collection of cards and construct 'War Decks'
- ???? Pay to Win ???

**Game Components:**

- Lobby search or matchmaking
- Main gameplay battles
- Deck building and Collection

**Gameplay**:

- Matches start with minions spawning at each players castle/nexus and move towards opponents castle/nexus, battling each other when they encounter enemies and/or towers
- Players start with opening hand of cards from their 'War Deck' - **3-5 **cards
- NOT TURNED BASED - players can play cards during any point throughout the match
- Card chaining mechanic - players can chain cards together. To chain, players must play cards within **3 **seconds of the previous card. Chain resolves in a first-in, first-out (queue) basis
- To win, player must destroy their opponents castle/nexus

**Gacha Deck Building:**

- Players construct decks using cards pulled from booster packs (loot box system)
- Boosters packs can be purchased via in-game currency (earned or bought with real money)
- Players start with a starter deck
- Collection - players can customize their decks from a collection of cards they own
- Multiple copies of the same card can be owned
- Tiers of rarity - **common, rare, super-rare, ultimate, etc.**

**System Design:**

- Client: handles main game play loop, physics, and rendering. **DETERMINISTIC AI** - AI controlled minions follow same logic to ensure game state is consistent across game clients.
  - **MUST ENSURE LOGIC YIELDS SAME RESULT ACROSS DIFFERENT PLATFORMS **ex.: Floating point precision will yield slightly different results depending on CPU, OS, etc.
  - Game clients send user input (Cards played) to the game server
  - Card effects applied client side - only indicator that card was played sent to server to be emitted to other client
- Server: **AUTHORITATIVE -** Ensures the game state is consistent between players and in sync
  - Emits user inputs received to other player
  - Will periodically check current game state to prevent cheating
    - Have a game state object with properties:
      - minion upgrades
      - minion speed
      - number of minions spawned per wave
      - players current card count
      - etc.
  - Given limitations of rendering client side, must figure out a way to keep gamestate in sync between both connected clients
    - when game is paused, or rendering stops (app is minimized)
      - Possible solution: Snapshot all game assets on paused client, send to server as frame to be emitted back to clients when paused client resumes
- Database: stores player profile, stats, decks, and card collection

**Tech Stack:**

- Client: Vite + React
  - UI and Views: React SPA
  - Game Engine: Typescript
- Server: Node.js w/ Socket.io
- DB: SQL (PostgreSQL) or NoSQL (MongoDB)
- Platform - Electron bundled app
- Testing via standard web hosting

**Development Pipeline:**

- Build out client side game play loop and rendering engine
- Construct back end server
- **TESTING AI MINIONS ONLY**
  - Ensure uniformity between connected clients during a simulated match
- Create 'War Deck' mechanic
- **TESTING WAR DECK MECHANIC**
  - Ensure game state is synced between clients
  - Client inputs passed to server -> emitted to other client
- Lobby or matchmaking - means to set up matches between clients
  - Create Lobby View/Matching Making View
- Create player schemas and hook up a database to store player info
- Collection and Deck Building
- Gacha Booster Packs
  - Strip integration????

**PLATFORM DECISION:**

- Web Application - hosted via PaaS providers/AWS
- Steam???
  - App will have to be bundled with Electron
