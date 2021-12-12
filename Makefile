.PHONY: test
test:
	docker-compose run --rm node npm test

.PHONY: test-silent
test-silent:
	docker-compose run --rm node npm test --silent

.PHONY: bash
bash:
	docker-compose run --rm node bash

.PHONY: down
down:
	docker-compose down