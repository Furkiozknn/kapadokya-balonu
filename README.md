# Kapadokya Balonu

**A 3D hot-air balloon wind puzzle over Cappadocia at sunrise.** You never steer sideways: you only heat the envelope
with the burner to climb or open the parachute vent to sink. The wind blows a different way at every height, so to go
somewhere you pick the layer that blows there. Fly low over marked spots, drop markers on crosses, photograph
landmarks from the right height, pick up passengers on hilltops and land softly on the trailer field before the
propane runs out.

Part of the Claude Game Arena series. One `index.html`, Three.js r170 from a CDN, everything else made in code.

<p align="center"><img src="docs/02-flight.png" width="720" alt="Flying over the fairy chimneys of Uçhisar with the wind ladder, goals and instruments"></p>

## Highlights

- **Wind layers instead of a rudder.** Each flight has its own wind table: four layers stacked by altitude, each with
  its own direction and speed. Mist streaks drift with each layer and three dozen other balloons ride the layers too,
  so you can see the wind. The wind ladder on the left shows the live layers, turned to your camera, and paints the
  layers that blow towards your goal green.
- **A balloon with lag.** The burner heats the envelope; the lift follows the temperature a few seconds later; the
  envelope cools by itself. The envelope gauge shows the hover line, so you learn to burn early and stop early.
  Propane is limited, and a passenger adds weight.
- **12 flights in 3 regions.** Göreme (village, mosque, launch field, Paşabağ and Love Valley), Uçhisar (the castle
  rock and Pigeon Valley) and an Ihlara-like canyon with a river and poplars. Weather: calm dawn, gusty, morning fog
  that lifts as the sun rises, and thermal bubbles at noon.
- **Five kinds of goals.** Low pass, marker drop, photo from a given height, passenger pickup on a hilltop and the
  landing, scored for sink rate, distance to the cross and ground speed. Stars for every goal, fuel left and a soft
  landing: 36 in all.
- **Living valley.** Flat-shaded fairy chimneys with dark caps and carved cave-house windows, vineyards, apricot
  orchards, a winding river, birds, a dawn sky that turns from violet to gold, long soft shadows, burner roar and
  flame light on the envelope.
- **Played by a bot.** `?auto` flies all 12 flights with the same burner and vent a player has. It plans by simulating
  short burner/vent plans forward with the same physics and the mean winds shown on the ladder, then re-plans every
  1.5 s. It earns all 36 stars.

## How to play

> [!TIP]
> Hold the burner until the balloon lifts, then look at the wind ladder: a green arrow is a layer that blows towards
> the goal. Climb or sink into it and let it carry you. The temperature lags: stop burning before you reach the height
> you want.

Goals can be done in any order. The flight ends when the basket touches the trailer field (the white cross with
orange flags and the white light beam). Touching the ground anywhere else bumps the basket; brushing treetops or a
fairy chimney costs damage and frightens the passengers. Drifting out of the valley, wrecking the basket or running out
of propane away from the field fails the flight.

| Goal | What to do |
|---|---|
| Low pass | Cross the orange ring below 25 m above the ground |
| Marker drop | Press `D` so the sandbag lands within 15 m of the white cross; the wind moves it as it falls |
| Photo | Press `F` between 70 and 420 m from the landmark, within 20 m of the given height (the gold ring) |
| Pick up | Touch down on the hilltop with the flag; the passenger makes the balloon heavier |
| Landing | Touch down on the trailer field; slow and near the cross is best |

**Stars:** every goal met, fuel left at or above the flight's mark (the tick on the fuel bar), and a landing score of
65 or more. Finishing a flight on the field unlocks the next one.

### Controls

| Action | Mouse / touch | Keyboard |
|---|---|---|
| Burner (heat, climb) | hold the big orange button, or hold the left mouse button on the view | hold `Space` |
| Vent (cool, sink) | hold the blue button | hold `V` |
| Photo | camera button | `F` |
| Drop a marker | marker button | `D` |
| Camera: chase / basket / map | eye button | `C` |
| Orbit / look around | drag | arrow keys |
| Zoom | wheel or pinch | `+` / `-` |
| Game speed 1× / 2× / 4× | speed button | `T` |
| Pause | pause button | `P` / `Esc` |
| Music / effects / language | HUD buttons | `M` / `X` / `L` |

Settings are saved in `localStorage` under `arena.kapadokya.settings`, progress (stars, finished flights, best landing
scores) under `arena.kapadokya.save` and the best star total under `arena.kapadokya.best`. Turkish is the default
language; phones start on the Low quality tier.

<details>
<summary><b>URL flags for testing</b></summary>

| Flag | Effect |
|---|---|
| `?auto` | a bot flies all 12 flights to the ending, using only burner, vent, photo and drop |
| `?debug` | fps, draw calls, triangles, GPU name and JS errors on screen; `window.kapadokyaSim(seconds)` fast-forwards without rendering |
| `?sim=N` | fast-forward N seconds before the first frame |
| `?low` | shadows off, pixel ratio 1, half the particles, wind streaks and other balloons |
| `?flight=N` | start straight in flight N (1-12) |
| `?speed=N` | game speed 1, 2 or 4 (the bot defaults to 2) |
| `?lang=en` / `?lang=tr` | language |
| `?nosave` | do not write to `localStorage` |
| `?noassets` | accepted; the game ships no asset files, so it changes nothing |

The live state is on `window.kapadokya` (screen, flight, altitude, temperature, fuel, goals, stars, bot log, fps, draw
calls, errors and `assets`).

</details>

## Screenshots

<table>
  <tr>
    <td width="33%"><img src="docs/01-title.png" alt="Title screen"><br><sub>Title screen</sub></td>
    <td width="33%"><img src="docs/03-region-map.png" alt="Region map with the flight briefing and wind table"><br><sub>Region map and briefing</sub></td>
    <td width="33%"><img src="docs/04-landing.png" alt="Landing report with stars"><br><sub>Landing report</sub></td>
  </tr>
  <tr>
    <td><img src="docs/05-group-photo.png" alt="Ending: group photo on the launch field"><br><sub>Ending: the group photo</sub></td>
    <td><img src="docs/06-phone.png" alt="Kapadokya Balonu on a phone over Uçhisar"><br><sub>On a phone</sub></td>
    <td></td>
  </tr>
</table>

## Running locally

Serve the folder over HTTP (ES modules do not load from `file://`):

```
python -m http.server 8000
```

then open <http://localhost:8000/>.

## How it was made

Built by **Claude Opus 5.5** with Claude Code from one prompt: [prompts/kapadokya-balonu.md](prompts/kapadokya-balonu.md).
Everything is generated in code, so there are no asset files and no credits to list.

- **Simulation core:** terrain, wind layers, balloon physics, goals and the bot live in one plain script with no
  Three.js or DOM, so the same code runs in a Node harness. The terrain is a 20 m height grid shared by the render mesh
  and the physics, with the same triangulation. The balloon has an envelope temperature (burner +8.5 °C/s, Newton
  cooling, vent), a lift that follows the temperature with a 3.5 s lag, quadratic drag and a horizontal velocity that
  relaxes to the wind of its altitude. Gusts are smooth noise on each layer; thermals are lift columns.
- **Flights as data:** the 12 flights are one table of wind layers, goals, fuel and landing fields. Hills under the
  pickups and flat fields under launches and landings are carved into the terrain from that table. Goal positions
  were laid out by flying a scripted pilot through each wind table, then checked by the bot.
- **Bot:** a model-predictive pilot. Every 1.5 s it simulates about 200 two-step altitude plans 150 s ahead (230 s for
  the landing) with the same physics and the mean winds, scores them for reaching the current goal, fuel, obstacle
  clearance and touchdown speed, and flies the best one with burner and vent pulses. It takes photos and drops markers
  when the same checks a player sees say yes.
- **3D:** flat-shaded vertex-coloured terrain (36k triangles), instanced fairy chimneys, caps, cave windows, houses,
  orchards and vines, 36 instanced balloons, instanced wind streaks and birds, one shadow-casting sun that follows the
  balloon, a shader sky and one Points pool for dust, leaves and thermal sparkles. About 20-30 draw calls.
- **Audio:** Web Audio only: a bağlama-like plucked melody in an Uşşak-like scale over a frame drum in 9/8 aksak, a
  drone, a far-away call to prayer as a soft vowel pad gliding through a Hicaz phrase with echoes (no recording),
  burner roar, vent hiss, wind, birdsong, shutter, thuds and applause.

## Licence

MIT, see [LICENSE](LICENSE).
