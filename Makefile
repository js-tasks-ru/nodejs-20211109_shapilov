.PHONY: test
test:
	docker-compose run --rm node npm test

.PHONY: down
down:
	docker-compose down