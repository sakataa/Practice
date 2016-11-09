namespace DangerousRaceGame.Forms
{
    using System;
    using System.IO;
    using System.Text;
    using System.Windows.Forms;

    public partial class Question : Form
    {
        private readonly string _fileName;
        public Question(string fileName)
        {
            InitializeComponent();
            _fileName = fileName;
        }

        private async void Question_Load(object sender, EventArgs e)
        {
            try
            {
                var path = "../../Questions/" + _fileName;
                var questionText = new StringBuilder();
                using (StreamReader sr = new StreamReader(path))
                {
                    var line = await sr.ReadToEndAsync();
                    questionText.Append(line);
                }

                lblQuestion.Text = questionText.ToString();
            }
            catch (Exception ex)
            {
                // ignored
            }
        }
    }
}