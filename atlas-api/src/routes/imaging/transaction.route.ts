import {Router} from 'express';
import Route from '@interfaces/routes.interface';
import TransactionController from "@controller/imaging/transaction.controller";


class TransactionRoute implements Route {
    public path = '';
    public router = Router();
    private transactionController = new TransactionController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/number/masked/:application`,
            this.transactionController.getNumberMaskedTransaction);

        this.router.get(`${this.path}/number/unmasked/:application`,
            this.transactionController.getNumberTransaction);

        this.router.post(`${this.path}/batch/masked/:application`,
            this.transactionController.getBatchMaskedTransaction);

        this.router.post(`${this.path}/batch/unmasked/:application`,
            this.transactionController.getBatchTransaction);

        this.router.post(`${this.path}/mask/filter/:application`,
            this.transactionController.maskTransactionWithFilter);

        this.router.get(`${this.path}/insights/unmasked/:application`,
            this.transactionController.getInsightsUnmaskedTransactions);

        this.router.get(`${this.path}/mask/single/:application/:transactionID`,
            this.transactionController.maskTransaction);

        this.router.get(`${this.path}/unmask/single/:application/:transactionID`,
            this.transactionController.unmaskTransaction);

        this.router.get(`${this.path}/unmask/all/:application`,
            this.transactionController.unmaskAllTransaction);

        this.router.get(`${this.path}/mask/by/:application`,
            this.transactionController.maskByObjectCount);
    }
}

export default TransactionRoute;

