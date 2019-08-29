#include <stdio.h>

#define MAXLINE 1000

int get_line(char line[], int maxline);
void remove_trailing_spaces(char line[]);

int main()
{
    /* Exercise 1-18
       Write a program to remove trailing blanks and tabs from each line of input,
       and to delete entirely blank lines.
    */
    printf("Input text (press ctrl+d to end):\n");
    int i;
    char line[MAXLINE];
    
    while (get_line(line, MAXLINE) > 0)
    {
        remove_trailing_spaces(line);
        printf("\"");
        for (i=0; line[i] != '\0'; ++i)
            printf("%c", line[i]);
        printf("\"\n");
    }
    return 0;
}

int get_line(char s[], int lim)
{
    int c, i, m;
    i = m = 0;
    while ((c = getchar()) != EOF && c != '\n')
    {
        if (i < lim - 1)
        {
            s[i] = c;
            ++i;
        }
        ++m;
    }
    s[i] = '\0';
    return m;
}

void remove_trailing_spaces(char line[])
{
    int i, b;
    b = 0;
    for (i=0; line[i] != '\0'; ++i)
    {
        if (b == 0 && (line[i] == '\t' || line[i] == ' '))
            b = i;
        if (b != 0 && (line[i] != '\t' && line[i] != ' ' && line[i] != '\0'))
            b = 0;
    }
    if (b == 1)
        line[0] = '\0';
    if (b != 0)
        line[b] = '\0';
}
