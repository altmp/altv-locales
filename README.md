# altv-locales
This repository contains locales for alt:V Multiplayer and appropriate flags.

# Flags
Flags were taken from [madebybowtie/FlagKit](https://github.com/madebybowtie/FlagKit/tree/1597c8872150299fe1d7a18d8c7403730da309c6/Assets/SVG)
and licenced under MIT License available [here](https://github.com/madebybowtie/FlagKit/blob/1597c8872150299fe1d7a18d8c7403730da309c6/LICENSE)

All credits go to the authors.

# Adding your lang
When you wanna any language to appear in alt:V Multiplayer copy en.json to [locale_code].json and replace all string entries. Then find your flag in the repo above and copy it under flags/ directory 

# Plural keys

For plural keys use keys in `KEY_NAME:PLURAL_TYPE` format. List of plural types and rules can be found [here](https://unicode-org.github.io/cldr-staging/charts/37/supplemental/language_plural_rules.html) (beware that plural type should be specified in the uppercase).
Lookup order for plural keys is:
- `KEY_NAME:EXPECTED_PLURAL_TYPE`
- `KEY_NAME`
- `KEY_NAME:OTHER`

## Currently supported plural keys:
- `PLAYERS_ONLINE`
- `SERVERS_ONLINE`