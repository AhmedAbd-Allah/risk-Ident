import { Controller, Get, Query } from '@nestjs/common';
import * as testData from '../../test-data_072020.json';
const _ = require('lodash');
require('deepdash')(_);

@Controller('transactions')
export class TransactionsController {
    @Get()
    getTransactions(@Query() query): any[] {

        let transaction = this.getTransactionByID(query.transactionId)
        let transactionsList = this.filterChildrenTransactions(query.confidenceLevel, transaction)
        return transactionsList;
    }

    getTransactionByID(id: string) {
        let transaction;
        _.eachDeep(
            testData,
            (child, i, parent, ctx) => {
                if (parent.id == id) {
                    transaction = parent
                    return false;
                }
                else if (child.id == id) {
                    transaction = child
                    return false;
                }
            },
            { childrenPath: 'children' }
        );
        return transaction;
    }

    filterChildrenTransactions(confidenceLevel, parentTransaction) {
        parentTransaction = this.removeTransactionConnectionInfo(parentTransaction)
        let filteredTransactions = [parentTransaction]
        if (this.checkChildrenExistence(parentTransaction)) {
            filteredTransactions = this.filterTransactionsByConfidenceLevel(parentTransaction, filteredTransactions, confidenceLevel)
            filteredTransactions = this.deleteTranasctionsNestedChildren(filteredTransactions)
            filteredTransactions = this.removeDuplicates(filteredTransactions, transaction => transaction.id)
        }
        return filteredTransactions;
    }

    filterTransactionsByConfidenceLevel(parentTransaction: any, filteredTransactions, confidenceLevel) {
        _.eachDeep(
            parentTransaction["children"],
            (grandChild, i, child, ctx) => {

                if (Array.isArray(child)) {

                    child = child.map(element => {
                        if (element.connectionInfo.confidence >= confidenceLevel) {
                            element.combinedConnectionInfo = {
                                confidence: element.connectionInfo.confidence,
                                type: [element.connectionInfo.type]
                            }
                            filteredTransactions.push(element)
                        }
                    })
                }
                else if (grandChild.connectionInfo && grandChild.connectionInfo.confidence >= confidenceLevel) {
                    grandChild.combinedConnectionInfo = {
                        confidence: Number((Number(grandChild.connectionInfo.confidence) * Number(child.connectionInfo.confidence)).toFixed(2)),
                        type: Array.isArray(child.combinedConnectionInfo.type) ? [...child.combinedConnectionInfo.type, grandChild.connectionInfo.type] : [child.combinedConnectionInfo.type, grandChild.connectionInfo.type]
                    }
                    filteredTransactions.push(grandChild)
                }
            },
            { childrenPath: 'children' }
        );
        return filteredTransactions;
    }

    deleteTranasctionsNestedChildren(filteredTransactions: any) {
        filteredTransactions.forEach(element => {
            delete element.children
        });
        return filteredTransactions;
    }

    removeTransactionConnectionInfo(transaction: any) {
        delete transaction['connectionInfo']
        return transaction

    }

    checkChildrenExistence(transaction: any) {
        return transaction['children'] && transaction['children'].length > 0 ? true : false
    }

    removeDuplicates(arrayOfTransactions: any, key) {
        return [
            ...new Map(
                arrayOfTransactions.map(transaction => [key(transaction), transaction])
            ).values()
        ]
    }

    // removeCombinedConnectionInfoTypesDuplicates(transactionsList: any) {
    //     transactionsList.forEach(transaction => {
    //         if (transaction.combinedConnectionInfo)
    //             transaction.combinedConnectionInfo.type = this.removeDuplicatesFromArrayOfStrings(transaction.combinedConnectionInfo.type)
    //     })
    //     return transactionsList
    // }

    // removeDuplicatesFromArrayOfStrings(combinedConnectionInfoTypes: [string]) {
    //     return combinedConnectionInfoTypes.filter((value, index) => combinedConnectionInfoTypes.indexOf(value) === index)
    // }

}
