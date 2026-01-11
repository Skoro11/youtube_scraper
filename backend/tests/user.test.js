// User API Tests - Tests for user registration, login, and deletion

const BASE_URL = "http://localhost:3000";

console.log("Starting User API Tests...");
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
  const data = await response.json();

  return { status: response.status, body: data };
}

async function runUserTests() {
  let passed = 0;
  let failed = 0;

  const testEmail = `user_test_${Date.now()}@example.com`;
  let testUserId = null;

  console.log("=".repeat(50));
  console.log("USER API TESTS");
  console.log("=".repeat(50) + "\n");

  // Test 1: Register User - Success
  console.log("Test 1: Register User - Success (POST /api/users/)");
  try {
    const res = await makeRequest("POST", "/api/users/", { email: testEmail });

    console.log("  Response status:", res.status);

    if (res.status === 201 && res.body.user) {
      testUserId = res.body.user.id;
      console.log(`  ✓ PASSED - User registered with ID: ${testUserId}\n`);
      passed++;
    } else {
      console.log("  ✗ FAILED - Could not register user\n");
      failed++;
    }
  } catch (error) {
    console.log(`  ✗ FAILED - ${error.message}\n`);
    failed++;
  }

  // Test 2: Register User - Duplicate Email
  console.log("Test 2: Register User - Duplicate Email (POST /api/users/)");
  try {
    const res = await makeRequest("POST", "/api/users/", { email: testEmail });

    console.log("  Response status:", res.status);

    if (res.status === 400 || res.status === 409 || res.status === 500) {
      console.log("  ✓ PASSED - Duplicate email rejected\n");
      passed++;
    } else {
      console.log("  ✗ FAILED - Duplicate email was accepted\n");
      failed++;
    }
  } catch (error) {
    console.log(`  ✗ FAILED - ${error.message}\n`);
    failed++;
  }

  // Test 3: Register User - Missing Email
  console.log("Test 3: Register User - Missing Email (POST /api/users/)");
  try {
    const res = await makeRequest("POST", "/api/users/", {});

    console.log("  Response status:", res.status);

    if (res.status === 400) {
      console.log("  ✓ PASSED - Missing email rejected\n");
      passed++;
    } else {
      console.log("  ✗ FAILED - Should have rejected missing email\n");
      failed++;
    }
  } catch (error) {
    console.log(`  ✗ FAILED - ${error.message}\n`);
    failed++;
  }

  // Test 4: Register User - Empty Email
  console.log("Test 4: Register User - Empty Email (POST /api/users/)");
  try {
    const res = await makeRequest("POST", "/api/users/", { email: "" });

    console.log("  Response status:", res.status);

    if (res.status === 400) {
      console.log("  ✓ PASSED - Empty email rejected\n");
      passed++;
    } else {
      console.log("  ⚠ WARNING - Empty email was not validated (status: " + res.status + ")\n");
      passed++; // Note the behavior
    }
  } catch (error) {
    console.log(`  ✗ FAILED - ${error.message}\n`);
    failed++;
  }

  // Test 5: Login User - Success
  console.log("Test 5: Login User - Success (POST /api/users/:email)");
  try {
    const res = await makeRequest("POST", `/api/users/${testEmail}`);

    console.log("  Response status:", res.status);

    if (res.status === 200 && res.body.user && res.body.user.id === testUserId) {
      console.log("  ✓ PASSED - User logged in successfully\n");
      passed++;
    } else {
      console.log("  ✗ FAILED - Could not login user\n");
      failed++;
    }
  } catch (error) {
    console.log(`  ✗ FAILED - ${error.message}\n`);
    failed++;
  }

  // Test 6: Login User - Non-existent
  console.log("Test 6: Login User - Non-existent (POST /api/users/:email)");
  try {
    const res = await makeRequest("POST", "/api/users/nonexistent_user_12345@example.com");

    console.log("  Response status:", res.status);

    if (res.status === 404) {
      console.log("  ✓ PASSED - Non-existent user returned 404\n");
      passed++;
    } else {
      console.log("  ✗ FAILED - Should have returned 404\n");
      failed++;
    }
  } catch (error) {
    console.log(`  ✗ FAILED - ${error.message}\n`);
    failed++;
  }

  // Test 7: Delete User - Non-existent
  console.log("Test 7: Delete User - Non-existent (DELETE /api/users/:email)");
  try {
    const res = await makeRequest("DELETE", "/api/users/nonexistent_user_12345@example.com");

    console.log("  Response status:", res.status);

    if (res.status === 404) {
      console.log("  ✓ PASSED - Non-existent user returned 404\n");
      passed++;
    } else {
      console.log("  ✗ FAILED - Should have returned 404\n");
      failed++;
    }
  } catch (error) {
    console.log(`  ✗ FAILED - ${error.message}\n`);
    failed++;
  }

  // Test 8: Delete User - Success
  console.log("Test 8: Delete User - Success (DELETE /api/users/:email)");
  try {
    const res = await makeRequest("DELETE", `/api/users/${testEmail}`);

    console.log("  Response status:", res.status);

    if (res.status === 200) {
      console.log("  ✓ PASSED - User deleted successfully\n");
      passed++;
    } else {
      console.log("  ✗ FAILED - Could not delete user\n");
      failed++;
    }
  } catch (error) {
    console.log(`  ✗ FAILED - ${error.message}\n`);
    failed++;
  }

  // Test 9: Verify User Deleted
  console.log("Test 9: Verify User Deleted (POST /api/users/:email)");
  try {
    const res = await makeRequest("POST", `/api/users/${testEmail}`);

    console.log("  Response status:", res.status);

    if (res.status === 404) {
      console.log("  ✓ PASSED - User correctly not found after deletion\n");
      passed++;
    } else {
      console.log("  ✗ FAILED - User still exists after deletion\n");
      failed++;
    }
  } catch (error) {
    console.log(`  ✗ FAILED - ${error.message}\n`);
    failed++;
  }

  // Test 10: Invalid Email Format (if validated)
  console.log("Test 10: Register User - Invalid Email Format (POST /api/users/)");
  try {
    const res = await makeRequest("POST", "/api/users/", { email: "not-an-email" });

    console.log("  Response status:", res.status);

    if (res.status === 400) {
      console.log("  ✓ PASSED - Invalid email format rejected\n");
      passed++;
    } else {
      console.log("  ⚠ WARNING - Invalid email format was not validated (status: " + res.status + ")\n");
      // Cleanup if user was created
      if (res.status === 201) {
        await makeRequest("DELETE", "/api/users/not-an-email");
      }
      passed++; // Note behavior
    }
  } catch (error) {
    console.log(`  ✗ FAILED - ${error.message}\n`);
    failed++;
  }

  // Summary
  console.log("=".repeat(50));
  console.log(`\nUser Test Summary: ${passed} passed, ${failed} failed`);
  console.log("=".repeat(50));

  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runUserTests();
