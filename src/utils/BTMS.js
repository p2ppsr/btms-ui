import { BTMS } from '../../../btms-core/out/src';

const ENV = location.host.startsWith('staging') || location.host.startsWith('localhost') ? 'test' : 'prod'

const btms = new BTMS(
  ENV === 'test' ? 'https://staging-confederacy.babbage.systems' : undefined,
  ENV === 'test' ? 'https://staging-peerserv.babbage.systems' : undefined
)

export default btms
