#encoding: utf-8

import sys
import time

reload(sys)
sys.setdefaultencoding('utf-8')

from services.stock.StockCrawlerService import StockCrawlerService


def lastTradeDate():
    today = time.localtime()
    if today.tm_wday > 4:
        today = time.localtime(time.time() - 3600 * 24 * (today.tm_wday - 4))
    return today


if __name__ == '__main__':
    today = time.strftime('%Y-%m-%d', lastTradeDate())
    print today

    StockCrawlerService.fetchAllStockBaseModules()