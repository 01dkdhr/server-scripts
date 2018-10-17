# coding=utf-8
from __future__ import print_function, absolute_import, unicode_literals
from gm.api import *
import json
import os

def init(context):
    subscribe(symbols='SHSE.600000', frequency='1d')

def on_bar(context, bars):
    # 打印当前获取的bar信息
    bar = bars[0]
    # 执行策略逻辑操作
    print(bar)

if __name__ == '__main__':
    f = open("local-config.json", 'r')
    config = json.load(f)
    run(strategy_id='strategy_1', filename=os.path.split(__file__)[-1], mode=MODE_BACKTEST, token=config['token'],
        backtest_start_time='2016-06-17 13:00:00', backtest_end_time='2017-08-21 15:00:00')