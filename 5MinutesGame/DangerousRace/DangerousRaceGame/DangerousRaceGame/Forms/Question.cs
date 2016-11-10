namespace DangerousRaceGame.Forms
{
    using System;
    using System.IO;
    using System.Text;
    using System.Windows.Forms;

    public partial class Question : Form
    {
        private readonly Timer _timer;
        private int _counter;
        private readonly string _fileName;
        public Question(string fileName)
        {
            InitializeComponent();
            _fileName = fileName;
            _timer = new Timer();
        }

        private async void Question_Load(object sender, EventArgs e)
        {
            try
            {
                var path = "../../Questions/" + _fileName;
                using (StreamReader sr = new StreamReader(path))
                {
                    var time = await sr.ReadLineAsync();
                    if (!string.IsNullOrEmpty(time))
                    {
                        _counter = Convert.ToInt32(time);
                        lblTime.Text = time;
                    }
                    var questionText = await sr.ReadToEndAsync();
                    lblQuestion.Text = questionText;
                    InitTimer();
                }
            }
            catch (Exception ex)
            {
                // ignored
            }
        }

        private void InitTimer()
        {
            _timer.Tick += timer_Tick;
            _timer.Interval = 1000; // 1 second
            _timer.Start();
        }

        private void timer_Tick(object sender, EventArgs e)
        {
            _counter--;
            if (_counter == 0)
                _timer.Stop();
            lblTime.Text = _counter.ToString();
        }
    }
}