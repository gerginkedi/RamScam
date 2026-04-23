import '../styles/Shop.css';
import '../styles/index.css';
import Layout from '../components/layout';
import { useShards } from '../useShards';
import { useBuffs } from '../useBuffs';
import { BUFFS } from '../useBuffs';

function BuffCard({ buff, onBuy, canAfford, isActive, remainingUses }) {
    return (
        <div className={`shop-card ${isActive ? 'shop-card-active' : ''} ${!canAfford ? 'shop-card-disabled' : ''}`}>
            <div className='shop-card-icon'>{buff.icon}</div>
            <div className='shop-card-info'>
                <h3>{buff.name}</h3>
                <p className='shop-card-uses'>
                    {buff.maxUses === 1 ? '1 kullanım' : `${buff.maxUses} el`}
                </p>
                {isActive && (
                    <p className='shop-card-remaining'>
                        Kalan: {remainingUses} {buff.maxUses === 1 ? 'kullanım' : 'el'}
                    </p>
                )}
            </div>
            <div className='shop-card-footer'>
                <span className='shop-card-cost'>⟡ {buff.cost}</span>
                <button
                    className='shop-card-btn'
                    onClick={() => onBuy(buff.id)}
                    disabled={!canAfford || isActive}
                >
                    {isActive ? 'Aktif' : 'Satın Al'}
                </button>
            </div>
        </div>
    );
}

function Shop() {
    const { shardBalance, removeShard, canAfford } = useShards();
    const { activateBuff, hasBuff, getBuffUses } = useBuffs();

    const handleBuy = (buffId) => {
        const buff = BUFFS[buffId];
        if (!buff || !canAfford(buff.cost)) return;
        removeShard(buff.cost);
        activateBuff(buffId);
    };

    return (
        <Layout>
            <div className='shop-root'>
                <div className='shop-header'>
                    <h1 className='shop-title'>Mağaza</h1>
                    <div className='shop-balance'>
                        <span>⟡</span>
                        <span>{shardBalance} Shard</span>
                    </div>
                </div>
                <p className='shop-subtitle'>
                    Aktif buff'lar satın alındığında hemen devreye girer.
                    Birden fazla buff aynı anda aktif olabilir.
                </p>
                <div className='shop-grid'>
                    {Object.values(BUFFS).map(buff => (
                        <BuffCard
                            key={buff.id}
                            buff={buff}
                            onBuy={handleBuy}
                            canAfford={canAfford(buff.cost)}
                            isActive={hasBuff(buff.id)}
                            remainingUses={getBuffUses(buff.id)}
                        />
                    ))}
                </div>
            </div>
        </Layout>
    );
}

export default Shop;