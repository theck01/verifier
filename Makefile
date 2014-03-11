MOCHA = node_modules/.bin/mocha
MOCHA_OPTS = -R spec
TESTS = spec/verifier.spec.js

.PHONY: test

build:
	npm install

test: build
	@$(MOCHA) $(MOCHA_OPTS) $(TESTS)

debug-test: build
	@$(MOCHA) debug $(MOCHA_OPTS) $(TESTS)
