from datetime import datetime, date, timedelta


def get_current_week_dates():

    today = date.today()
    start_of_week = today - timedelta(days=today.weekday())

    # tmp = """ "" """" . """date("2025-05-13 12:21:13.342+00")
    # print(tmp)

    for i in range(7):
        current_date = start_of_week + timedelta(days=i)
        current_date = current_date.strftime("%B %d")
        print(current_date)


def main():
    get_current_week_dates()


if __name__ == "__main__":
    main()
