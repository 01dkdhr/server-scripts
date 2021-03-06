# coding=utf-8
# 获取到交易标的基本信息

from __future__ import print_function, absolute_import, unicode_literals
from gm.api import *
import json
import os
import time
from pymongo import MongoClient

import sys
reload(sys)
sys.setdefaultencoding('utf-8') 

filename = os.path.split(__file__)[-1]
f = open("local-config.json", 'r')
config = json.load(f)
mongoInfo = config['mongo-db']

def init(context):
    result = get_instrumentinfos(symbols=None, exchanges=None, sec_types=None, names=None, fields=None, df=False)
    lst = []
    for item in result:
        if item[u'sec_type'] == 1:
            item[u'delisted_date'] = time.mktime(item[u'delisted_date'].timetuple())
            item.pop(u'listed_date')
            lst.append(item) 

    # 写到数据库
    client = MongoClient(mongoInfo['host'], mongoInfo['port'])
    db = client['node-stock']
    db.authenticate(mongoInfo['user'], mongoInfo['password'])
    db.stocks.insert_many(lst)

if __name__ == '__main__':
    run(strategy_id='strategy_1', filename=filename, mode=MODE_BACKTEST, token=config['token'],
        backtest_start_time='2016-06-17 13:00:00', backtest_end_time='2017-08-21 15:00:00')