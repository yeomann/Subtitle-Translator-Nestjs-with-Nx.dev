# Run

Please check start-app.md for running the App.

# Description

Project uses NX.dev monorepo architecture. A Subtitles Translator project is a attempt to translates subtitles, it takes one or several subtitle files as input and produces the subtitles in the same format containing the translations of each one of the contained sentences.

Contains REST API for uploading subtitles in a plain text format (.txt) and send an email with the translation as attachment once the process done. TMS databank endpoint is also part of http app for getting new translations.


The translation is performed by using historical data stored in a 
[Translation Management System (TMS)](https://en.wikipedia.org/wiki/Translation_management_system) One translation is performed by going through the following steps:

1 - Parses the subtitles file and extract the translatable source.
2 - Translates the source using historical data.
3 - Pairs the result with the source.
4 - Reconstructs the subtitles file.

Example processing input of TMS:

```
1 [00:00:12.00 - 00:01:20.00] I am Arwen - I've come to help you.
2 [00:03:55.00 - 00:04:20.00] Come back to the light.
3 [00:04:59.00 - 00:05:30.00] Nooo, my precious!!.
```

The output for this input would be a file containing something as:

```
1 [00:00:12.00 - 00:01:20.00] Ich bin Arwen - Ich bin gekommen, um dir zu helfen.
2 [00:03:55.00 - 00:04:20.00] Komm zurück zum Licht.
3 [00:04:59.00 - 00:05:30.00] Nein, my Schatz!!.
```

In order to translate a query, it uses the following flow:

1 - Search for strings that are approximately equal in the database — They might not be the same but close enough to be consider a translation.

2 - It calculates the distance between the query and the closest string found. — A standard way of calculating strings distance is by using Levenshtein distance algorithm.
3 - If the distance is less than 5, is considered a translation, otherwise the same query is returned as result.

## Import interface of TMS

```
[
  {
    "source": "Hello World",
    "target": "Hallo Welt",
		"sourceLanguage": "en",
		"targetLanguage": "de"
  },
  {
    "source": "Hello guys",
    "target": "Hallo Leute",
		"sourceLanguage": "en",
		"targetLanguage": "de"
  },
  {
    "source": "I walk to the supermarket",
    "target": "Ich gehe zum Supermarkt.",
		"sourceLanguage": "en",
		"targetLanguage": "de"
  }
]
```

