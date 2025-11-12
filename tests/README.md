# Cloud Resume Project - Test Suite

This directory contains tests for the Cloud Resume Project.

## Running Tests

### Python Tests (Lambda Function)

Install test dependencies:
```bash
pip install pytest boto3 moto
```

Run tests:
```bash
pytest tests/test_lambda.py -v
```

### JavaScript Tests (Frontend)

Install test dependencies:
```bash
npm install --save-dev jest @testing-library/dom
```

Run tests:
```bash
npm test
```

## Test Coverage

To generate test coverage reports:

### Python
```bash
pytest --cov=backend tests/test_lambda.py
```

### JavaScript
```bash
npm test -- --coverage
```

## Writing Tests

### Test Structure

- `test_lambda.py` - Tests for AWS Lambda function
- `frontend.test.js` - Tests for frontend JavaScript
- Add more test files as needed

### Best Practices

1. Write tests for new features
2. Test edge cases and error handling
3. Mock external dependencies (AWS services, API calls)
4. Keep tests isolated and independent
5. Use descriptive test names
6. Aim for good test coverage (>80%)

## CI/CD Integration

Tests are automatically run in the GitHub Actions workflow on:
- Pull requests
- Pushes to main branch

See `.github/workflows/deploy.yml` for CI/CD configuration.
