# Postgres features for fizzy search

sudo apt-get install postgresql-contrib
CREATE EXTENSION pg_trgm;

1- Log into postgres

`psql -U <DB_USERNAME>`

2- After you are connected, switch to the DB you want to install the extension for:

`\c <DB_NAME>`

3- Then install the extension as answered previously:

`CREATE EXTENSION pg_trgm;`

### Similiarty word function

Similiarty is incase sensitive

Threshold of matching similarity can be adjusted as well.
https://www.postgresql.org/docs/9.6/pgtrgm.html

```sql
SET pg_trgm.similarity_threshold = 0.8; -- Postgres 9.6 or later
-- SELECT set_limit(0.8);               -- for older versions
```

# Get threshold

Default is 0.3

```sql
1  - SHOW pg_trgm.similarity_threshold

2 - select  show_limit()
```

## Example code

Test words like below which will give the numebr answer
`select schema.similarity('word', 'two words');`
Give all columns back with similarity according to input which is in this case is "Nooo"
`SELECT id, target, "source", similarity(t."source", 'Nooo') FROM subtitle_translator_dev.tms t`
local example
`select schema.similarity('word', 'two words');`

### Also possible to do Levenshtein in postgres

https://www.freecodecamp.org/news/fuzzy-string-matching-with-postgresql/

```sql
SELECT *, LEVENSHTEIN(name, 'Freda Kallo')
FROM artists
ORDER BY LEVENSHTEIN(name, 'Freda Kallo') ASC
LIMIT 5
```

## Good read

https://www.compose.com/articles/mastering-postgresql-tools-full-text-search-and-phrase-search/
