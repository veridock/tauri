#!/bin/bash

# Tauri Veridock - Test Runner
# Runs all tests in the tests/ directory

set -e  # Exit on any error

echo "🧪 Tauri Veridock - Test Suite Runner"
echo "===================================="
echo

# Configuration
TEST_DIR="tests"
LOG_FILE="test-results.log"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

# Initialize log
echo "=== Test Run - $TIMESTAMP ===" > "$LOG_FILE"

# Test files to run
TESTS=(
    "env.test.js"
    "sync-window-size.test.js"
    "integration.test.js"
)

# Counters
total_tests=0
passed_tests=0
failed_tests=0

# Functions
run_test() {
    local test_file=$1
    local test_path="$TEST_DIR/$test_file"
    
    echo "🔍 Running: $test_file"
    echo "----------------------------------------"
    
    if [ ! -f "$test_path" ]; then
        echo "❌ Test file not found: $test_path"
        ((failed_tests++))
        return 1
    fi
    
    # Run the test and capture output
    if node "$test_path" 2>&1 | tee -a "$LOG_FILE"; then
        echo "✅ $test_file completed successfully"
        ((passed_tests++))
    else
        echo "❌ $test_file failed"
        ((failed_tests++))
    fi
    
    echo
    ((total_tests++))
}

# Pre-test checks
echo "🔧 Pre-test setup..."

# Ensure we're in the project root
if [ ! -f "env.js" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check Node.js availability
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed or not in PATH"
    exit 1
fi

# Generate fresh environment files for testing
echo "🔄 Generating fresh environment files..."
node env.js > /dev/null 2>&1 || {
    echo "⚠️  Warning: Failed to generate environment files"
}

echo "✅ Pre-test setup completed"
echo

# Run all tests
echo "🚀 Starting test execution..."
echo

for test in "${TESTS[@]}"; do
    run_test "$test"
done

# Summary
echo "📊 Test Execution Summary"
echo "========================"
echo "⏰ Execution time: $TIMESTAMP"
echo "📈 Total tests: $total_tests"
echo "✅ Passed: $passed_tests"
echo "❌ Failed: $failed_tests"

if [ $failed_tests -eq 0 ]; then
    echo "🎉 All tests passed!"
    echo "🚀 System is ready for deployment!"
    exit_code=0
else
    echo "🚨 $failed_tests test(s) failed!"
    echo "📝 Check $LOG_FILE for detailed error information"
    exit_code=1
fi

# Generate coverage report if possible
echo
echo "📋 Additional Information:"
echo "- Test logs saved to: $LOG_FILE"
echo "- Project root: $(pwd)"
echo "- Node.js version: $(node --version)"
echo "- Environment files status:"
ls -la env.* 2>/dev/null | head -5 || echo "  No environment files found"

echo
echo "🔧 Next steps:"
if [ $exit_code -eq 0 ]; then
    echo "1. Run './build.sh' to create production binaries"
    echo "2. Test binaries on different platforms"
    echo "3. Deploy to production"
else
    echo "1. Fix failing tests"
    echo "2. Re-run tests: './tests/run-all-tests.sh'"
    echo "3. Check logs: cat $LOG_FILE"
fi

exit $exit_code
