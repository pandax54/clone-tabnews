# Development
# TODO:
# dev-up:
# 	docker-compose -f infra/docker-compose.dev.yml up

# dev-build:
# 	docker-compose -f infra/docker-compose.dev.yml up --build

# dev-down:
# 	docker-compose -f infra/docker-compose.dev.yml down

# dev-clean:
# 	docker-compose -f infra/docker-compose.dev.yml down -v --rmi all
#   docker compose down --rmi all -v

# Testing
test:
	docker-compose -f infra/docker-compose.test.yml up --abort-on-container-exit

test-unit:
	docker-compose -f infra/docker-compose.test.yml run --rm nextjs-test npm run test:unit

test-integration:
	docker-compose -f infra/docker-compose.test.yml up --abort-on-container-exit integration-tests

# Production
# TODO
# prod-up:
# 	docker-compose -f infra/docker-compose.prod.yml up -d

# prod-down:
# 	docker-compose -f infra/docker-compose.prod.yml down

# prod-logs:
# 	docker-compose -f infra/docker-compose.prod.yml logs -f

# migrate-prod:
# 	docker-compose -f infra/docker-compose.prod.yml run --rm migrations

# Cleanup
clean-all:
	docker system prune -a --volumes

.PHONY: dev-up dev-build dev-down dev-clean test test-unit test-integration prod-up prod-down prod-logs migrate-prod clean-all