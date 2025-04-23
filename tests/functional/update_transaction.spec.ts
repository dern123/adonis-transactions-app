import { test } from '@japa/runner'
import Transaction from '#models/transaction'
import BankAccount from '#models/bank_account'
import { DateTime } from 'luxon'

test('update transaction and recalculate balances', async (ctx:any) => {
  const { client, assert } = ctx
  // 1. Створюємо рахунок і дві транзакції
  const account = await BankAccount.create({ accountName: 'Test', balance: 0 })

  const t1 = await Transaction.create({
    bankAccountId: account.id,
    date: DateTime.now(),
    type: 'income',
    price: 100,
    balanceAfter: 100,
  })

  const t2 = await Transaction.create({
    bankAccountId: account.id,
    date: DateTime.now(),
    type: 'income',
    price: 50,
    balanceAfter: 150,
  })

  // 2. Запит на оновлення першої транзакції
  const response = await client.put(`/transactions/${t1.id}`).json({
    price: 200,
    type: 'income',
  })

  response.assertStatus(200)

  // 3. Перевірка оновлених балансів
  await t1.refresh()
  await t2.refresh()

  assert.equal(t1.balanceAfter, 200)
  assert.equal(t2.balanceAfter, 250)
})
