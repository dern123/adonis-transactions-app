/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

// import router from '@adonisjs/core/services/router'

// router.get('/', async () => {
//   return {
//     hello: 'world',
//   }
// })

import router from '@adonisjs/core/services/router'
import TransactionsController from '#controllers/transactions_controller'

router.get('/transactions', [TransactionsController, 'index'])       // GET all
router.get('/transactions/:id', [TransactionsController, 'show'])   // GET by id
router.put('/transactions/:id', [TransactionsController, 'update']) // UPDATE

export default router

