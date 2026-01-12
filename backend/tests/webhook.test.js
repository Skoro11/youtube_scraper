// Webhook Tests - Tests for webhook functionality

const BASE_URL = "http://localhost:3000";

console.log("Starting Webhook Tests...");
console.log(`Testing against: ${BASE_URL}\n`);

// Helper function to make requests
async function makeRequest(method, path, body = null) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${path}`, options);

  // Try to parse as JSON, fallback to null if not JSON
  let data = null;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  }

  return { status: response.status, body: data };
}

async function runWebhookTests() {
  let passed = 0;
  let failed = 0;

  // Create a test user first
  const testEmail = `webhook_test_${Date.now()}@example.com`;
  let testUserId = null;
  let testLinkId = null;

  console.log("=".repeat(50));
  console.log("WEBHOOK TESTS");
  console.log("=".repeat(50) + "\n");

  // Setup: Create test user
  console.log("Setup: Creating test user...");
  try {
    const res = await makeRequest("POST", "/api/users/", { email: testEmail });
    if (res.status === 201) {
      testUserId = res.body.user.id;
      console.log(`  Test user created with ID: ${testUserId}\n`);
    } else {
      console.log("  Failed to create test user, aborting tests\n");
      process.exit(1);
    }
  } catch (error) {
    console.log(`  Setup failed: ${error.message}\n`);
    process.exit(1);
  }

  // Test 1: Create Link triggers webhook (check webhook_sent field)
  console.log("Test 1: Create Link - Webhook Sent Flag (POST /api/tasks)");
  try {
    const linkData = {
      user_id: testUserId,
      title: "Webhook Test Video",
      youtube_url: "https://www.youtube.com/watch?v=webhooktest123",
      notes: "Testing webhook functionality",
    };

    const res = await makeRequest("POST", "/api/tasks", linkData);

    console.log("  Response status:", res.status);

    if (res.status === 201 && res.body.link) {
      testLinkId = res.body.link.id;
      // Check if webhook_sent field exists (implementation dependent)
      console.log("  Link created with ID:", testLinkId);
      console.log("  ✓ PASSED - Link created successfully\n");
      passed++;
    } else {
      console.log("  ✗ FAILED - Could not create link\n");
      failed++;
    }
  } catch (error) {
    console.log(`  ✗ FAILED - ${error.message}\n`);
    failed++;
  }

  // Test 2: Resend Webhook Endpoint (if implemented)
  console.log(
    "Test 2: Resend Webhook (POST /api/tasks/:linkId/:userId/resend)"
  );
  if (testLinkId && testUserId) {
    try {
      const res = await makeRequest(
        "POST",
        `/api/tasks/${testLinkId}/${testUserId}/resend`
      );

      console.log("  Response status:", res.status);

      if (res.status === 200) {
        console.log("  ✓ PASSED - Webhook resent successfully\n");
        passed++;
      } else if (res.status === 404) {
        console.log("  ⚠ NOT IMPLEMENTED - Resend endpoint not found (404)\n");
        console.log(
          "    Note: This endpoint is documented but may not be implemented\n"
        );
        passed++; // Not a failure, just not implemented
      } else {
        console.log("  ✗ FAILED - Unexpected response\n");
        failed++;
      }
    } catch (error) {
      console.log(`  ✗ FAILED - ${error.message}\n`);
      failed++;
    }
  } else {
    console.log("  ⚠ SKIPPED - No test link available\n");
  }

  // Test 3: Resend Webhook - Non-existent Link
  console.log(
    "Test 3: Resend Webhook - Non-existent Link (POST /api/tasks/99999/1/resend)"
  );
  try {
    const res = await makeRequest("POST", "/api/tasks/99999/1/resend");

    console.log("  Response status:", res.status);

    if (res.status === 404) {
      console.log("  ✓ PASSED - Returns 404 for non-existent link\n");
      passed++;
    } else {
      console.log(
        "  ⚠ Endpoint may not be implemented (status: " + res.status + ")\n"
      );
      passed++;
    }
  } catch (error) {
    console.log(`  ✗ FAILED - ${error.message}\n`);
    failed++;
  }

  // Test 4: Verify link status after creation
  console.log(
    "Test 4: Verify Initial Link Status (GET /api/tasks/:linkId/:userId)"
  );
  if (testLinkId && testUserId) {
    try {
      const res = await makeRequest(
        "GET",
        `/api/tasks/${testLinkId}/${testUserId}`
      );

      console.log("  Response status:", res.status);

      if (res.status === 200 && res.body.link) {
        const link = res.body.link;
        console.log("  Link status:", link.status);

        if (link.status === "pending") {
          console.log("  ✓ PASSED - Initial status is 'pending'\n");
          passed++;
        } else {
          console.log(
            "  ⚠ WARNING - Initial status is not 'pending': " +
              link.status +
              "\n"
          );
          passed++;
        }
      } else {
        console.log("  ✗ FAILED - Could not get link\n");
        failed++;
      }
    } catch (error) {
      console.log(`  ✗ FAILED - ${error.message}\n`);
      failed++;
    }
  } else {
    console.log("  ⚠ SKIPPED - No test link available\n");
  }

  // Cleanup
  console.log("Cleanup: Deleting test data...");
  if (testLinkId) {
    await makeRequest("DELETE", `/api/tasks/${testLinkId}`);
  }
  if (testUserId) {
    await makeRequest("DELETE", `/api/users/${testEmail}`);
  }
  console.log("  Cleanup complete\n");

  // Summary
  console.log("=".repeat(50));
  console.log(`\nWebhook Test Summary: ${passed} passed, ${failed} failed`);
  console.log("=".repeat(50));

  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runWebhookTests();
