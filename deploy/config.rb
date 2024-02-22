# frozen_string_literal: true

BUILD_DIRECTORY = './dist'

DEVELOP_ENVIRONMENT = 'dev'
TAGGED_ENVIRONMENTS = %w[
  stage
  production
].freeze

CLOUDFRONT_DISTRIBUTIONS = {
  dev:        'EOM265TCTD47L',
  stage:      'E3L9T8KVBTR92J',
  production: ''
}.freeze
