import type { DayKind } from '../data/options'

export const kindClassMap: Record<DayKind, string> = {
  travel: 'kind-travel',
  fair: 'kind-fair',
  transfer: 'kind-transfer',
  LRVTC: 'kind-LRVTC',
  site: 'kind-site',
  ops: 'kind-ops',
  buffer: 'kind-buffer',
  debrief: 'kind-debrief',
}
