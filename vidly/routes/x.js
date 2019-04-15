/*
    Need to handle rental returns
    We don't want a generic update function on the rental, that allows
    client to modify fields that only the server should have access to.
*/

// POST /api/returns {customerId, movieId}

// TDD needed tests
//      return 401 if client is not authorized
//      return 400 if customerId is not provided
//      return 400 if movieId is not provided
//      return 404 if rental not found for {customerId, movieId}
//      return 400 if return already processed (rental already returned)
//      return 200 if valid request
//      set return date if valid request
//      calculate rental fee if valid request
//      return movie to rental stock (increment stock count)
//      return completed rental
