import type { Order } from '../store/StoreContext'

export function downloadReceipt(order: Order) {
  const receipt = {
    issuer: 'SOLE TRADER CORP // UNENCRYPTED SURVEILLANCE WEAR',
    record_id: order.recordId,
    issued_at: new Date(order.ts).toISOString(),
    cash_charged: 0.0,
    currency: 'USD',
    data_harvested_mb: order.mbHarvested,
    estimated_lifetime_value_usd: order.ltv,
    allocations: order.items.map((i) => ({
      hardware: i.name,
      size_us: i.size,
      quantity: i.qty,
      price_cash: 0.0,
    })),
    surrendered_assets: order.sold.map((s) => ({
      type: s.type,
      label: s.label,
      megabytes: s.mb,
      resale_value_usd: s.value,
    })),
    identity: {
      declared_name: order.identity.name,
      confession: order.identity.confession,
    },
    consents: {
      rem_microphone: order.remMic,
      courier_interrogation: order.courierConsent,
    },
    total_resale_value_usd: order.totalValue,
    note: 'This receipt is itself a data asset. By downloading it you have generated a new telemetry event.',
  }
  const blob = new Blob([JSON.stringify(receipt, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${order.recordId}-surrender-receipt.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
