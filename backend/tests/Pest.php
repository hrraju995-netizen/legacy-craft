<?php

use Tests\TestCase;

// Bind the Laravel TestCase to every test in these directories so helpers
// like seed(), actingAs() and RefreshDatabase are available.
pest()->extend(TestCase::class)->in('Feature', 'Unit');
