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
    // deepdash is used to filter transactions by transaction Id
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

    filterChildrenTransactions(confidenceLevel: Number, parentTransaction: any): any[] {
        parentTransaction = this.removeTransactionConnectionInfo(parentTransaction)
        let filteredTransactions = [parentTransaction]
        if (this.checkChildrenExistence(parentTransaction)) {
            filteredTransactions = this.filterTransactionsByConfidenceLevel(parentTransaction, filteredTransactions, confidenceLevel)
            filteredTransactions = this.deleteTranasctionsNestedChildren(filteredTransactions)
            filteredTransactions = this.removeDuplicates(filteredTransactions, transaction => transaction.id)
        }
        return filteredTransactions;
    }

    filterTransactionsByConfidenceLevel(parentTransaction: any, filteredTransactions: any[], confidenceLevel:Number) {
        _.eachDeep(
            parentTransaction["children"],
            (grandChild, i, child, ctx) => {
                // filtering first level of transactions by confidence level and add combinedConnectionInfo property
                // filtered transactions are then pushed to array to be used later on
                if (Array.isArray(child)) {
                    child = child.map(element => {
                        if (element.connectionInfo.confidence >= confidenceLevel) {
                            element.combinedConnectionInfo = {
                                // as the parent of first level of transactions is the main transaction itself so the confidence level remain as it is (1* confidenceLevel = confidenceLevel)
                                confidence: element.connectionInfo.confidence,
                                type: [element.connectionInfo.type]
                            }
                            filteredTransactions.push(element)
                        }
                    })
                }
                // filtering deeper levels of transactions by confidence level
                // filtered transactions are then pushed to array to be used later on
                else if (grandChild.connectionInfo && grandChild.connectionInfo.confidence >= confidenceLevel) {
                    grandChild.combinedConnectionInfo = {
                        // multiplying transaction confidenceLevel by its parent confidenceLevel
                        confidence: Number((Number(grandChild.connectionInfo.confidence) * Number(child.connectionInfo.confidence)).toFixed(2)),
                        // forming a list of connection info types by pushing transaction connection info type in array alognside all its parent transactions connectionInfo type
                        type: Array.isArray(child.combinedConnectionInfo.type) ? [...child.combinedConnectionInfo.type, grandChild.connectionInfo.type] : [child.combinedConnectionInfo.type, grandChild.connectionInfo.type]
                    }
                    filteredTransactions.push(grandChild)
                }
            },
            { childrenPath: 'children' }
        );
        return filteredTransactions;
    }

    // delete Tranasctions Nested Children to have a flattened structure result
    deleteTranasctionsNestedChildren(filteredTransactions: any[]) {
        filteredTransactions.forEach(element => {
            delete element.children
        });
        return filteredTransactions;
    }


    removeTransactionConnectionInfo(transaction: any) {
        delete transaction['connectionInfo']
        return transaction

    }

    // check if transaction has children
    checkChildrenExistence(transaction: any) {
        return transaction['children'] && transaction['children'].length > 0 ? true : false
    }

    removeDuplicates(arrayOfTransactions: any, key: any) {
        return [
            ...new Map(
                arrayOfTransactions.map(transaction => [key(transaction), transaction])
            ).values()
        ]
    }


}
