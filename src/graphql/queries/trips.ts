query Trips {
  trips {
    data {
      ...Trip
    }
    errors {
      ...BaseError
    }
  }
}
