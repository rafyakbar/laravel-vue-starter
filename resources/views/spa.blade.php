<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name') }}</title>
    @vite(['resources/app/assets/css/app.css', 'resources/app/main.ts'])
</head>
<body>
    <div id="app"></div>
</body>
</html>
