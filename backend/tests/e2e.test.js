// End-to-End Tests - Complete user flow

const BASE_URL = "http://localhost:3000";

// Test data
const testEmail = `test_${Date.now()}@example.com`;
let testUserId = null;
let testLinkId = null;

console.log("Starting End-to-End Tests...");
console.log(`Testing against: ${BASE_URL}`);
console.log(`Test email: ${testEmail}\n`);

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

async function runE2ETests() {
  let passed = 0;
  let failed = 0;

  console.log("=".repeat(50));
  console.log("PHASE 1: USER REGISTRATION & LOGIN");
  console.log("=".repeat(50) + "\n");

  // Test 1: Register User
  console.log("Test 1: Register New User (POST /api/users/)");
  try {
    const res = await makeRequest("POST", "/api/users/", { email: testEmail });

    console.log("  Response status:", res.status);
    console.log("  Response:", JSON.stringify(res.body, null, 2));

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

  // Test 2: Login User
  console.log("Test 2: Login User (POST /api/users/:email)");
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

  console.log("=".repeat(50));
  console.log("PHASE 2: YOUTUBE LINK MANAGEMENT");
  console.log("=".repeat(50) + "\n");

  // Test 3: Create YouTube Link
  console.log("Test 3: Create YouTube Link (POST /api/tasks)");
  try {
    const linkData = {
      user_id: testUserId,
      title: "E2E Test Video",
      youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      notes: "Created during E2E test",
    };

    const res = await makeRequest("POST", "/api/tasks", linkData);

    console.log("  Response status:", res.status);
    console.log("  Link data:", JSON.stringify(res.body.link, null, 2));

    if (res.status === 201 && res.body.link) {
      testLinkId = res.body.link.id;

      // Verify all fields
      const link = res.body.link;
      const fieldsCorrect =
        link.user_id === testUserId &&
        link.title === linkData.title &&
        link.youtube_url === linkData.youtube_url &&
        link.notes === linkData.notes &&
        link.status === "pending";

      if (fieldsCorrect) {
        console.log(`  ✓ PASSED - Link created with ID: ${testLinkId}\n`);
        passed++;
      } else {
        console.log("  ✗ FAILED - Link fields don't match\n");
        failed++;
      }
    } else {
      console.log("  ✗ FAILED - Could not create link\n");
      failed++;
    }
  } catch (error) {
    console.log(`  ✗ FAILED - ${error.message}\n`);
    failed++;
  }

  // Test 4: Get User's Links
  console.log("Test 4: Get User Links (GET /api/tasks/:userId)");
  try {
    const res = await makeRequest("GET", `/api/tasks/${testUserId}`);

    console.log("  Response status:", res.status);
    console.log("  Number of links:", res.body.links?.length || 0);

    if (res.status === 200 && res.body.links?.length > 0) {
      const foundLink = res.body.links.find((l) => l.id === testLinkId);
      if (foundLink) {
        console.log("  ✓ PASSED - Created link found in user's links\n");
        passed++;
      } else {
        console.log("  ✗ FAILED - Created link not found\n");
        failed++;
      }
    } else {
      console.log("  ✗ FAILED - Could not get links\n");
      failed++;
    }
  } catch (error) {
    console.log(`  ✗ FAILED - ${error.message}\n`);
    failed++;
  }

  // Test 5: Update Link (including youtube_url)
  console.log("Test 5: Update Link (PUT /api/tasks/:linkId)");
  try {
    const updateData = {
      title: "Updated E2E Test Video",
      youtube_url: "https://www.youtube.com/watch?v=updatedE2E",
      notes: "Updated notes",
    };

    const res = await makeRequest("PUT", `/api/tasks/${testLinkId}`, updateData);

    console.log("  Response status:", res.status);

    if (
      res.status === 200 &&
      res.body.link?.title === "Updated E2E Test Video" &&
      res.body.link?.youtube_url === "https://www.youtube.com/watch?v=updatedE2E"
    ) {
      console.log("  ✓ PASSED - Link updated successfully (title and youtube_url)\n");
      passed++;
    } else {
      console.log("  ✗ FAILED - Could not update link\n");
      failed++;
    }
  } catch (error) {
    console.log(`  ✗ FAILED - ${error.message}\n`);
    failed++;
  }

  // Test 6: Get Single Link
  console.log("Test 6: Get Single Link (GET /api/tasks/:linkId/:userId)");
  try {
    const res = await makeRequest(
      "GET",
      `/api/tasks/${testLinkId}/${testUserId}`
    );

    console.log("  Response status:", res.status);

    if (res.status === 200 && res.body.link?.title === "Updated E2E Test Video") {
      console.log("  ✓ PASSED - Single link retrieved with updated title\n");
      passed++;
    } else {
      console.log("  ✗ FAILED - Could not get single link\n");
      failed++;
    }
  } catch (error) {
    console.log(`  ✗ FAILED - ${error.message}\n`);
    failed++;
  }

  console.log("=".repeat(50));
  console.log("PHASE 3: STATUS MANAGEMENT");
  console.log("=".repeat(50) + "\n");

  // Test 7: Update Status to "processed" (simulating successful webhook)
  console.log("Test 7: Update Status to 'processed' (PATCH /api/tasks/:linkId/status)");
  try {
    const res = await makeRequest(
      "PATCH",
      `/api/tasks/${testLinkId}/status`,
      { status: "processed" }
    );

    console.log("  Response status:", res.status);
    console.log("  Link status:", res.body.link?.status);

    if (res.status === 200 && res.body.link?.status === "processed") {
      console.log("  ✓ PASSED - Status updated to 'processed'\n");
      passed++;
    } else {
      console.log("  ✗ FAILED - Could not update status\n");
      failed++;
    }
  } catch (error) {
    console.log(`  ✗ FAILED - ${error.message}\n`);
    failed++;
  }

  // Test 8: Verify status persisted
  console.log("Test 8: Verify Status Persisted (GET /api/tasks/:linkId/:userId)");
  try {
    const res = await makeRequest(
      "GET",
      `/api/tasks/${testLinkId}/${testUserId}`
    );

    console.log("  Response status:", res.status);
    console.log("  Link status:", res.body.link?.status);

    if (res.status === 200 && res.body.link?.status === "processed") {
      console.log("  ✓ PASSED - Status correctly persisted as 'processed'\n");
      passed++;
    } else {
      console.log("  ✗ FAILED - Status not persisted correctly\n");
      failed++;
    }
  } catch (error) {
    console.log(`  ✗ FAILED - ${error.message}\n`);
    failed++;
  }

  // Test 9: Update Status to "failed" (simulating failed webhook)
  console.log("Test 9: Update Status to 'failed' (PATCH /api/tasks/:linkId/status)");
  try {
    const res = await makeRequest(
      "PATCH",
      `/api/tasks/${testLinkId}/status`,
      { status: "failed" }
    );

    console.log("  Response status:", res.status);
    console.log("  Link status:", res.body.link?.status);

    if (res.status === 200 && res.body.link?.status === "failed") {
      console.log("  ✓ PASSED - Status updated to 'failed'\n");
      passed++;
    } else {
      console.log("  ✗ FAILED - Could not update status\n");
      failed++;
    }
  } catch (error) {
    console.log(`  ✗ FAILED - ${error.message}\n`);
    failed++;
  }

  // Test 10: Update Status back to "pending"
  console.log("Test 10: Update Status to 'pending' (PATCH /api/tasks/:linkId/status)");
  try {
    const res = await makeRequest(
      "PATCH",
      `/api/tasks/${testLinkId}/status`,
      { status: "pending" }
    );

    console.log("  Response status:", res.status);
    console.log("  Link status:", res.body.link?.status);

    if (res.status === 200 && res.body.link?.status === "pending") {
      console.log("  ✓ PASSED - Status updated to 'pending'\n");
      passed++;
    } else {
      console.log("  ✗ FAILED - Could not update status\n");
      failed++;
    }
  } catch (error) {
    console.log(`  ✗ FAILED - ${error.message}\n`);
    failed++;
  }

  console.log("=".repeat(50));
  console.log("PHASE 4: CLEANUP");
  console.log("=".repeat(50) + "\n");

  // Test 11: Delete Link
  console.log("Test 11: Delete Link (DELETE /api/tasks/:linkId)");
  try {
    const res = await makeRequest("DELETE", `/api/tasks/${testLinkId}`);

    console.log("  Response status:", res.status);

    if (res.status === 200) {
      console.log("  ✓ PASSED - Link deleted successfully\n");
      passed++;
    } else {
      console.log("  ✗ FAILED - Could not delete link\n");
      failed++;
    }
  } catch (error) {
    console.log(`  ✗ FAILED - ${error.message}\n`);
    failed++;
  }

  // Test 12: Delete User
  console.log("Test 12: Delete User (DELETE /api/users/:email)");
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

  // Test 13: Verify User Deleted
  console.log("Test 13: Verify User Deleted (POST /api/users/:email)");
  try {
    const res = await makeRequest("POST", `/api/users/${testEmail}`);

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

  // Summary
  console.log("=".repeat(50));
  console.log(`\nE2E Test Summary: ${passed} passed, ${failed} failed`);
  console.log("=".repeat(50));

  if (failed === 0) {
    console.log("\n✓ All end-to-end tests passed! The system is working correctly.\n");
  } else {
    console.log("\n✗ Some tests failed. Please check the issues above.\n");
  }

  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runE2ETests();
