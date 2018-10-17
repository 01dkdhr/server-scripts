# coding=utf-8
# 获取到交易标的基本信息

from __future__ import print_function, absolute_import, unicode_literals
from gm.api import *
import json
import os
import time

filename = os.path.split(__file__)[-1]

def init(context):
    result = history_n(symbol='SHSE.600000', frequency='1d', count=10, df=False)

    for item in result:
        item.eob = time.mktime(item.eob.timetuple())
        item.bob = time.mktime(item.bob.timetuple())

    f = open(filename + '.data', 'w')
    json.dump(result, f, indent=4)
    f.close()

if __name__ == '__main__':
    f = open("local-config.json", 'r')
    config = json.load(f)
    run(strategy_id='strategy_1', filename=filename, mode=MODE_BACKTEST, token=config['token'],
        backtest_start_time='2016-06-17 13:00:00', backtest_end_time='2017-08-21 15:00:00')