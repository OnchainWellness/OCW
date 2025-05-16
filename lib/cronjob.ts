import { schedule } from 'node-cron';
import { getExpiredSubscriptions } from '@/lib/User.js';
import { collectUserSubscription } from '@/lib/SubscriptionPayment';

// Programa una tarea para ejecutarse cada minuto
schedule('* * * * *', async () => {
    // cron.schedule('0 */2 * * *', () => {
    console.log('Ejecutando tarea cada minuto');
    const subscriptions = await getExpiredSubscriptions()
    console.log({subscriptions})
    subscriptions.forEach(subscription => {
        collectUserSubscription({
            address: subscription.user.address,
            amount: subscription.amount,
            period: subscription.period,
            salt: subscription.salt,
            token: subscription.token
        })
        .then(console.log)
        .catch(console.log)
        
    });
});

// Mantiene el proceso en ejecución
console.log('Cron job iniciado...');