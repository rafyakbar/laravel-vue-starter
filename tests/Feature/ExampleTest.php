<?php

it('returns a successful response from the root route', function () {
    $this->get('/')->assertSuccessful();
});
