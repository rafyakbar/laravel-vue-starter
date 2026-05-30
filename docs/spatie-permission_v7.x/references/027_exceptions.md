# Exception Handling

> Source: https://spatie.be/docs/laravel-permission/v7/advanced-usage/exceptions

## Overriding Default Exceptions

The package throws exceptions using standard Laravel mechanisms, so you can customize their behavior through Laravel's native exception handling.

## Primary Exception Class

The main exception you will encounter is:

```
\Spatie\Permission\Exceptions\UnauthorizedException
```

This is thrown when a user attempts an action they lack authorization for.

## Customizing the Response

You can override how `UnauthorizedException` is rendered by adding a handler in `bootstrap/app.php`:

```php
->withExceptions(function (Exceptions $exceptions) {
    $exceptions->render(function (\Spatie\Permission\Exceptions\UnauthorizedException $e, $request) {
        return response()->json([
            'responseMessage' => 'You do not have the required authorization.',
            'responseStatus'  => 403,
        ]);
    });
})
```

This approach lets you return a custom JSON payload, redirect to a specific page, or apply any other response logic that fits your application's needs.
