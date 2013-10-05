MOCHA = node_modules/.bin/mocha
MOCHA_OPTS = -R spec
TESTS = spec/verifier.spec.js

.PHONY: test

test:
	@$(MOCHA) $(MOCHA_OPTS) $(TESTS)

debug-test:
	@$(MOCHA) debug $(MOCHA_OPTS) $(TESTS)
