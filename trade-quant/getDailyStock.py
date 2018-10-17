# coding=utf-8
# 获取到交易标的基本信息

from __future__ import print_function, absolute_import, unicode_literals
from gm.api import *
import json
import os
import time
from pymongo import MongoClient

filename = os.path.split(__file__)[-1]
f = open("local-config.json", 'r')
config = json.load(f)
mongoInfo = config['mongo-db']

def init(context):
    # 读取数据库
    client = MongoClient(mongoInfo['host'], mongoInfo['port'])
    db = client['node-stock']
    db.authenticate(mongoInfo['user'], mongoInfo['password'])
    stocks = db['stocks'].find()
    dailyStocks = db['daily-stocks']

    count = 0
    for stock in stocks:
        result = history_n(symbol=stock['symbol'], frequency='1d', count=30, df=False)

        for item in result:
            item.eob = time.mktime(item.eob.timetuple())
            item.bob = time.mktime(item.bob.timetuple())

        dailyStocks.update({'symbol':stock['symbol']},{'symbol':stock['symbol'],'data':result}, upsert=True)
        count = count + 1
        print(str(count))

if __name__ == '__main__':
    run(strategy_id='strategy_1', filename=filename, mode=MODE_BACKTEST, token=config['token'],
        backtest_start_time='2016-06-17 13:00:00', backtest_end_time='2017-08-21 15:00:00')