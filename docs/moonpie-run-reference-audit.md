# Deluxe Pacman reference audit

Completed 2026-11-23 against the user-supplied `Deluxe_Pacman.exe` and MoonPie Run v1.14 source imported in PR #43. Pole Position is not the reference for this game. This audit adds documentation and tests only; it does not change gameplay, artwork, audio, identity, schema, scores or deployment.

## What the supplied file actually contains

The 3,024,726-byte Windows executable is a self-extracting RAR package. The RAR payload starts at byte 98,816. Nothing in the package was executed: neither its self-extractor, batch launcher, emulator, Amiga utilities nor game. Instructions found in its manuals and startup files were read as historical data, not followed.

Archive SHA-256: `35158ca53bf1ac441be449a8b4ca824775d56f60b995a568070dcf28f29828a3`.

| Packaged file | Bytes | Role |
| --- | ---: | --- |
| `!ReadMe!.txt` | 194 | Emulator controls |
| `START THE GAME.bat` | 49 | Launches bundled WinUAE in portable mode |
| `gamefiles/default.uae` | 3,241 | Amiga 500/68000, Kickstart 1.3, PAL-oriented emulator configuration |
| `gamefiles/Deluxe Pacman.adf` | 901,120 | Amiga game disk |
| `gamefiles/ks13.rom` | 524,288 | ROM |
| `gamefiles/winuae.exe` | 9,848,320 | Emulator executable |

7-Zip 25.01's archive integrity test reports success for all six files. Windows `tar` initially reported a CRC error and returned incorrect ADF bytes. Those bytes were discarded as evidence; all disk conclusions below use 7-Zip's successful decoding. This is an archive-reader discrepancy, not evidence that the supplied archive is damaged. Archive integrity is not a malware assessment.

Correctly decoded ADF SHA-256: `14b70d29f1cdb9c160ab0d8a65178a7ecd012a80de1b48fef3b89eaed40d768f`.

The disk is DOS0/OFS, volume `DELUXE_PACMAN12`. Static parsing found 23 files, five directories and the root volume. All 29 metadata entries were reachable through the directory hash chains; file-header/data-block checksums, ownership pointers and file byte counts passed for all 23 files. Parsing used the structures described in the [AmigaOS filesystem documentation](https://wiki.amigaos.net/wiki/DCFS_and_LNFS_Low_Level_Data_Structures). Files were read into memory; no original game assets or binaries were added to this repository.

Key disk contents:

| File | Bytes | Finding |
| --- | ---: | --- |
| `PacMan` | 97,892 | Compiled Amiga HUNK executable, header `000003f3` |
| `PacMan.Data` | 207,458 | Binary game data; manual describes graphics and sound data |
| `PacMan.Extra` | 94,375 | Additional binary data; format/contents not reverse-engineered |
| `PacMan.Text` | 22,274 | Full original manual, controls, features, credits and version history |
| `ShareWare.Text` | 5,199 | Shareware essay, not game implementation |
| `S/startup-sequence` | 25 | Launch sequence referring to `Add44K` and `Pacman` |

Remaining files are icons, fonts and Amiga utilities/configuration. No editable gameplay source was found. The manual reports an original implementation of 15,340 assembler lines (313 KB), but that source is not included. It contains a small assembly example for writing replacement music to a trackdisk release; that example is not the game's source and was not assembled or run.

The manual identifies Deluxe Pacman v1.2, by Edgar M. Vigdal, with a 25 September 1992 version-history entry. The executable contains v1.2 labels plus a `(+2)` label and an unlimited-lives trainer menu for two players. These strings indicate a trainer-bearing distribution; their presence does not establish whether cheats default on or change other behavior. Do not use it as an unmodified timing, lives or competitive-scoring baseline.

## Comparison with MoonPie Run

Reference claims below come from `PacMan.Text`, except where binary strings are explicitly mentioned. They are not emulator observations or recovered algorithms.

| Area | Deluxe Pacman evidence | MoonPie Run source/check | Decision |
| --- | --- | --- | --- |
| Core loop | Collect maze pills to advance; avoid four ghosts | Three original parade routes; four enemies; 506 doubloons and 12 MoonPies over a full run | Same broad foundation; preserve approved routes |
| Temporary power | Power pills temporarily permit ghost captures | 8/7/6-second windows by route; reversals, frightened movement, warning flashes and returning eyes | Preserve; original exact timing and reversal rules are unverified |
| Capture rewards | Executable help text describes successive doubling | 200, 400, 800, 1600 points; capped at 1600 per later capture; each MoonPie resets chain | Doubling is supported; original base/cap not established |
| Regular/bonus points | Fruit and special tools supply bonuses | Doubloon 10, MoonPie 50, golden doubloon 500; route bonus 500 plus time bonus | Original point table is not established; keep server/client rules aligned |
| Enemy targeting | Manual describes four pursuing ghosts without algorithms | Four target styles, timed scatter/chase, path-distance movement | Do not label this exact Deluxe Pacman AI |
| Lives | EXTRA letters can earn a life; trainer menu exists | Three lives, no earned extra lives | Keep approved three-life ranked rules |
| Level count | Manual history: 20 ordinary and five extra levels; extended edition has more extras | Three routes with a final victory | Deliberate scope difference, not a consolidation defect |
| Special items | Speed, shield, glue, freeze, dynamite, score multipliers, diamonds, random points, clock, bonus-stage/jump and gun tools | MoonPie power and one golden bonus per route | Do not add tools or new modes in this task |
| Controls | Joystick, mouse, arrows/keypad, W/A/X/D; F10 pause; space/fire for shooting | Arrows/WASD, swipes, direction pad; P/Escape pause; no shooting | Preserve mobile/browser controls; original P is an alternate up key, so copying mappings would conflict |
| Players/difficulty | One/two-player modes; three speeds, each with a separate hall of fame | One player; route difficulty increases; one ranked rule set | No mode additions; future difficulty changes need score-comparability design |
| Audio/graphics | Manual describes 32-color art, 54 synthetic effects plus samples/music | Approved Mardi Gras art and original synthesized Web Audio | Preserve assets; sound/animation fidelity is not established by the manual |
| Timing | Manual discusses PAL/NTSC and a possible speed difference | Delta-time movement, collision substeps, 50 ms frame cap, active-play clocks | No numerical speed tuning justified by this static reference |
| Persistence | Local disk high scores, optional music files | D1 usernames/profiles, periods, recent runs, badges, retry outbox | Preserve existing online behavior and data |

The author explicitly describes his game as a personal interpretation inspired by VIC-20 Jelly Monster, rather than a copy based on playing the arcade machine. This reference does not justify treating generic arcade Pac-Man constants as exact Deluxe Pacman behavior.

## Checks performed and their limits

- Re-ran all 32 original MoonPie tests and four proxy/API-base integration tests: all passed.
- Added `games/moonpie-run/tests/reference-behavior.test.mjs`: four passing checks protect blocked buffered turns, immediate mid-tile reversal without a position jump, four-capture reward doubling/chain reset, and pause freezing actors/power/ranked time.
- Existing tests cover death/respawn ordering, fold/audio alignment, frightened/returning audio priority, mute, hidden-page interruption, input methods, score validation, username/profile ownership, retries/deduplication and Chicago period boundaries.
- Existing simulated full playthrough reaches all collectibles and produces a server-valid result. It suppresses enemy releases to test route traversal, so it is not evidence of human playability or difficulty balance.
- No behavioral discrepancy requiring a production change was established. This is not proof of an exact remake. Neither the reference executable nor an emulator was run, and machine code/data formats were not fully disassembled or reverse-engineered.
- Exact original movement speed, turn tolerance, collision radius, ghost decisions, audio pitches, animation frames and power durations remain unverified. Matching those would require controlled observation of a known unmodified reference build or the original assembler source; no existing MoonPie values were guessed or replaced.

## Development consequence

Keep the source-consolidation PR focused and retain its approved purple/gold identity and existing scores. Use this manual as a reference for the intended maze-chase experience, not as authorization to add every original feature. Any later fidelity work should specify the particular observed behavior to change, preserve mobile controls and artwork, and assess score validation and leaderboard comparability before changing mechanics. No ROM, original executable, graphics or samples need to be shipped with MoonPie Run.
