import type { HttpContext } from '@adonisjs/core/http'
import { TransactionService } from '#services/transaction_service'
import Transaction from '#models/transaction'

export default class TransactionsController {
  public async update(ctx: HttpContext) {
    const { request, params, response } = ctx
    const transactionId = Number(params.id) //

    const data = request.only(['price', 'type'])

    try {
      await TransactionService.updateTransactionWithRecalculation(transactionId, data)
      return response.ok({ message: 'Transaction updated and balances recalculated' })
    } catch (error) {
      console.error(error)
      return response.status(500).send({ error: 'Something went wrong' })
    }
  }

   // GET /transactions/:id
   public async show({ params, response }: HttpContext) {
    const transaction = await Transaction.find(params.id)

    if (!transaction) {
      return response.status(404).json({ message: 'Transaction not found' })
    }

    return response.ok(transaction)
  }

  // GET /transactions
  public async index({ response }: HttpContext) {
    const transactions = await Transaction.all()
    return response.ok(transactions)
  }
}
