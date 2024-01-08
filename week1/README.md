# Week 1 - Life Calendar

## Description

This week we will be creating a life calendar. A life calendar is a grid of squares, where each square represents a week of your life. The idea is that you fill in each square with a color to represent how you spent that week. This is a great way to visualize your life and see how you are spending your time.

## Configuration

To add your birthdate and your expected lifetime span insert your data in the config JSON object:

```json
{
    "birthdate": "1984-12-15",
    "lifetime": 80
}
```

You can also add to events on the same configuration file:

```json
{
    "birthdate": "1984-12-15",
    "lifetime": 80,
    "events": [
        { "week": 1, "description": "Born" },
        { "week": 52, "description": "First birthday" },
        { "week": 2038, "description": "Started the first week of my Weekly App Odyssey project" }
        ]
}
```

## Deploy

To deploy this project:

1) Clone this repository

```bash
  git clone https://github.com/vitaled/weekly-app-odyssey
```

1) Move to the week1 directory:

```bash
  cd week1
```

2) Install http-server

```bash
  npm install http-server -g
```

3) Run the http-server

```bash
  http-server . -p 8000
```

4) Open your browser and go to <http://localhost:8000>
